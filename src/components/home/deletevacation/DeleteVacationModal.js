import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVacationsState } from '../../../store/actions'
import { Button } from '@material-ui/core'
import Modal from 'react-bootstrap/Modal'

const DeleteVacationModal = ({ deleteVacationModalOpen, setDeleteVacationModalOpen, vacationName, id}) => {
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const dispatch = useDispatch()
    const vacations = useSelector(state => state.vacations.data)

    // Delete vacation
    const deleteVacation = async (id) => {
        try {
            setButtonDisabled(true)
            const res = await fetch('/vacation',{
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ id })
                })
            const { success } = await res.json()
            if(success) {
                const newVacationArray = vacations.filter(vacation => vacation.id !== id)
                dispatch(setVacationsState(newVacationArray))
                setButtonDisabled(false)
                setDeleteVacationModalOpen(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Modal size="md" centered show={deleteVacationModalOpen} onHide={() => setDeleteVacationModalOpen(false)} style={{margin:'70px auto 30px', textAlign:'center'}}>
        <Modal.Header>
            <Modal.Title style={{fontWeight:'700'}}> Are you sure you want to delete the wonderfull vacation to {vacationName} ? </Modal.Title>
         </Modal.Header>
        <Modal.Body>
            <Button disabled={buttonDisabled} className="my-3" variant="contained" color="secondary" type="submit" size="large" onClick={() => deleteVacation(id)}> Delete vacation </Button>
        </Modal.Body>
        </Modal>
    )
}

export default DeleteVacationModal
